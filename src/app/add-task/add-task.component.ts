import { Component, ElementRef, HostListener } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Contact } from '../interfaces/contacts';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskItem } from '../interfaces/task';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [HttpClientModule, NgFor, NgIf, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent {
  contacts: Contact[] = [];
  selectedContacts: Contact[] = [];
  selectedPriority: string = 'Medium';
  selectedDate: string = '';
  selectedCategory: number | null = null;
  subtask: string = '';
  textArray: string[] = [];
  dropdownOpen: boolean = false;

  title: string = '';
  description: string = '';
  userId: number | null = null;

  task: TaskItem = {
    title: '',
    description: '',
    assigned_to: [],
    due_date: '',
    priority: 'Medium',
    category: 1,
    subtasks: [],
    users: [],
  };

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    try {
      this.contacts = await this.loadContacts();
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId !== null) {
        this.userId = parseInt(storedUserId, 10);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  loadContacts() {
    const url = environment.baseUrl + '/user/contacts';
    return lastValueFrom(this.http.get<Contact[]>(url));
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onCheckboxChange(event: any, contact: Contact) {
    if (event.target.checked) {
      this.selectedContacts.push(contact);
    } else {
      const index = this.selectedContacts.findIndex((c) => c.id === contact.id);
      if (index !== -1) {
        this.selectedContacts.splice(index, 1);
      }
    }
  }

  isSelected(contact: Contact): boolean {
    return this.selectedContacts.some((c) => c.id === contact.id);
  }

  selectPriority(priority: string) {
    this.selectedPriority = priority;
  }

  addText() {
    if (this.subtask.trim()) {
      this.textArray.push(this.subtask);
      this.subtask = '';
    }
  }

  createTask() {
    if (this.userId !== null) {
      this.task.users = [this.userId];
    }
    this.task.title = this.title;
    this.task.description = this.description;
    this.task.due_date = this.formatDate(this.selectedDate);
    this.task.assigned_to = this.selectedContacts.map((contact) => contact.id);
    this.task.priority = this.selectedPriority as 'Low' | 'Medium' | 'Urgent';
    this.task.subtasks = this.textArray;
    this.task.category =
      this.selectedCategory !== null ? this.selectedCategory : 1;

    const url = `${environment.baseUrl}/tasks/`;

    this.http.post(url, this.task).subscribe({
      next: (response) => {
        console.log('Task created:', response);

        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating task:', error);
      },
    });
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.selectedContacts = [];
    this.selectedDate = '';
    this.subtask = '';
    this.textArray = [];
    this.selectedPriority = 'Medium';
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
