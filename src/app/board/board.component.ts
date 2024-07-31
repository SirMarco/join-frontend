import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgFor, AsyncPipe } from '@angular/common';

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  progress: string;
  category: number;
  assigned_to: number[];
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [NgFor, AsyncPipe],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  tasks: Task[] = [];
  todo: Task[] = [];
  awaitFeedback: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  error: string = '';
  currentTask: Task | null = null;

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    try {
      this.tasks = await this.loadTasks();
      this.updateTaskLists();
      console.log(this.tasks);
    } catch (error) {
      this.error = 'fehler beim laden';
    }
  }

  loadTasks() {
    const url = environment.baseUrl + '/tasks/';
    return lastValueFrom(this.http.get<Task[]>(url));
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
    console.log('onDragStart');
    this.currentTask = task;
    console.log(this.currentTask);
  }

  onDrop(event: DragEvent, progress: string) {
    console.log('event', event);
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
    console.log('onDragOver');
    event.preventDefault();
  }

  onDragEnter(event: DragEvent, id: string) {
    console.log('onDragEnter', id);
    this.highlight(id);
  }

  onDragLeave(event: DragEvent, id: string) {
    console.log('onDragLeave', id);
    this.removeHighlight(id);
  }

  updateTask(task: Task) {
    console.log('Updating task:', task);
    const url = `${environment.baseUrl}/tasks/${task.id}/`;
    const updatedTask = { progress: task.progress };
    return lastValueFrom(this.http.patch(url, updatedTask));
  }

  highlight(id: string) {
    let element: HTMLElement | null = document.getElementById(id);

    if (element) {
      if (!element.querySelector('.drag-area-drop-here')) {
        let dropCard = document.createElement('div');
        dropCard.textContent = 'Drop';
        dropCard.id = 'dropHere';
        dropCard.classList.add('drag-area-drop-here', 'font-21-light');
        element.appendChild(dropCard);
      }
      element.classList.add('drag-area-highlight');
    }
  }

  removeHighlight(id: string) {
    console.log('removeHighlight', id);
    let highlightedElement = document.getElementById(id);
    if (highlightedElement) {
      highlightedElement.classList.remove('drag-area-highlight');
    }

    let elementToRemove = document.getElementById('dropHere');
    if (elementToRemove && elementToRemove.parentNode) {
      elementToRemove.parentNode.removeChild(elementToRemove);
    }
  }
}
