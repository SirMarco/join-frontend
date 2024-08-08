import { Component } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Contact } from '../interfaces/contacts';
import { TaskItem } from '../interfaces/task';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, NoteDialogComponent, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent {
  currentDate: string;
  selectedContacts: Contact[] = [];
  selectedPriority: string = 'Low';
  selectedDate: string = '';

  title: string = '';
  description: string = '';
  showNoteDialog: boolean = false;
  valid: boolean = true;

  task: TaskItem = {
    title: '',
    description: '',
    due_date: '',
    priority: 'Low',
  };

  constructor(private http: HttpClient) {
    this.currentDate = new Date().toISOString().slice(0, 10);
  }

  async ngOnInit() {}

  selectPriority(priority: string) {
    this.selectedPriority = priority;
  }

  createTask() {
    const url = `${environment.baseUrl}/tasks/`;
    this.task.title = this.title;
    this.task.description = this.description;
    this.task.due_date = this.formatDate(this.selectedDate);
    this.task.priority = this.selectedPriority as 'Low' | 'Medium' | 'Urgent';
    this.http.post(url, this.task).subscribe({
      next: (response) => {
        console.log(response);

        this.showNoteDialog = true;
        this.resetForm();
      },
      error: (error) => {
        this.valid = false;
      },
    });
  }

  closeDialog() {
    this.showNoteDialog = false;
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.selectedDate = '';
    this.selectedPriority = 'Low';
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  // für späteres Portfolio update mit contacts und subtask
  /*
  onCheckboxChange(event: Event, contact: Contact) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedContacts.push(contact);
    } else {
      const index = this.selectedContacts.findIndex((c) => c.id === contact.id);
      if (index !== -1) {
        this.selectedContacts.splice(index, 1);
      }
    }
  }
  */
}
