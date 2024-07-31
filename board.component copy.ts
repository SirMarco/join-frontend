import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
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
  imports: [DragDropModule, NgFor, AsyncPipe],
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

  async drop(event: CdkDragDrop<Task[]>) {
    console.log('Drop event:', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const task = event.item.data;
    task.progress = event.container.id;

    try {
      await this.updateTask(task);
      this.updateTaskLists();
    } catch (error) {
      this.error = 'fehler beim aktualisieren';
    }
  }

  updateTask(task: Task) {
    const url = `${environment.baseUrl}/tasks/${task.id}/`;
    console.log(task);

    const updatedTask = { progress: task.progress };
    return lastValueFrom(this.http.patch(url, updatedTask));
  }
}
