import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  progress: string;
  // category: number;
  // assigned_to: number[];
}

interface Contact {
  id: number;
  name: string;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [NgFor, AsyncPipe, TaskDialogComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  tasks: Task[] = [];
  todo: Task[] = [];
  contacts: Contact[] = [];
  awaitFeedback: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  error: string = '';
  currentTask: Task | null = null;
  showDialog: boolean = false;
  selectedPriority: string = '';

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    try {
      this.tasks = await this.loadTasks();
      this.updateTaskLists();
    } catch (error) {
      this.error = 'fehler beim laden';
    }
  }

  async loadTasks() {
    const url = environment.baseUrl + '/tasks/';
    return await lastValueFrom(this.http.get<Task[]>(url));
  }

  updateTaskLists() {
    this.todo = this.tasks.filter((task: Task) => task.progress === 'Todo');
    this.awaitFeedback = this.tasks.filter(
      (task: Task) => task.progress === 'Await_Feedback'
    );
    this.inProgress = this.tasks.filter(
      (task: Task) => task.progress === 'inProgress'
    );
    this.done = this.tasks.filter((task: Task) => task.progress === 'Done');
  }

  onDragStart(task: Task) {
    this.currentTask = task;
  }

  onDrop(event: DragEvent, progress: string) {
    event.preventDefault();
    if (this.currentTask) {
      const record = this.tasks.find((m) => m.id === this.currentTask!.id);
      if (record) {
        record.progress = progress;
        this.updateTask(record);
        this.updateTaskLists();
      }
      this.removeHighlight(progress);
      this.currentTask = null;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragEnter(event: DragEvent, id: string) {
    this.highlight(id);
  }

  onDragLeave(event: DragEvent, id: string) {
    this.removeHighlight(id);
  }

  updateTask(task: Task) {
    const url = `${environment.baseUrl}/tasks/${task.id}/`;
    const updatedTask = { progress: task.progress };
    return lastValueFrom(this.http.patch(url, updatedTask));
  }

  highlight(id: string) {
    let element: HTMLElement | null = document.getElementById(id);
    if (element) {
      if (!element.querySelector('.drag-area-drop-here')) {
        let dropCard = document.createElement('div');
        dropCard.textContent = 'Drop here';
        dropCard.id = 'dropHere';
        dropCard.classList.add('drag-area-drop-here', 'font-21-light');
        element.appendChild(dropCard);
      }
      element.classList.add('drag-area-highlight');
    }
  }

  removeHighlight(id: string) {
    let highlightedElement = document.getElementById(id);
    if (highlightedElement) {
      highlightedElement.classList.remove('drag-area-highlight');
    }

    let elementToRemove = document.getElementById('dropHere');
    if (elementToRemove && elementToRemove.parentNode) {
      elementToRemove.parentNode.removeChild(elementToRemove);
    }
  }

  openTaskDialog(task: Task): void {
    this.currentTask = task;
    this.selectedPriority = this.currentTask.priority;
    this.showDialog = true;
  }

  closeTaskDialog(): void {
    this.showDialog = false;
    this.currentTask = null;
  }

  async onTaskDeleted(taskId: number) {
    this.tasks = await this.loadTasks();
    this.updateTaskLists();
  }

  // für späteres Portfolio update mit contacts und subtask
  /*

  getUserContactNames(userContactIds: number[]): string[] {
    return userContactIds.map((id) => {
      const userContact = this.contacts.find((u) => u.id === id);
      return userContact ? userContact.name : 'Unknown Contact';
    });
  }
    */
}
