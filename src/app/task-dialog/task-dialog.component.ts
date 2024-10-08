import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss', './task-dialog.component28.scss'],
})
export class TaskDialogComponent implements OnInit {
  @Input() task: any;
  @Input() userNames: string[] = [];
  @Output() closeDialog = new EventEmitter<void>();
  @Output() taskDeleted = new EventEmitter<number>();

  editMode = false;
  selectedPriority: string = '';
  tempTask: any = {};
  categories: any[] = []; // Array to store categories

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.tempTask = { ...this.task }; // Create a copy of the task object
    this.loadCategories(); // Load categories when component initializes
  }

  onClose() {
    this.closeDialog.emit();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.tempTask = { ...this.task }; // Reset tempTask to task values
    }
  }

  saveChanges() {
    const url = `${environment.baseUrl}/tasks/${this.tempTask.id}/`;
    this.http.put(url, this.tempTask).subscribe({
      next: (response) => {
        this.task = { ...this.tempTask }; // Update the task object with tempTask values
        this.editMode = false;
      },
      error: (error) => {
        console.error('Error updating task:', error);
      },
    });
  }

  deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
      const url = `${environment.baseUrl}/tasks/${this.task.id}/`;
      this.http.delete(url).subscribe({
        next: (response) => {
          console.log('Task deleted:', response);
          this.taskDeleted.emit(this.task.id); // Emit Event to notify parent component
          this.onClose();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        },
      });
    }
  }

  selectPriority(priority: string) {
    this.tempTask.priority = priority;
  }

  getPriorityClass() {
    return {
      'priority-low': this.task.priority === 'Low',
      'priority-medium': this.task.priority === 'Medium',
      'priority-urgent': this.task.priority === 'Urgent',
    };
  }

  getPriorityClassEdit(priority: string) {
    return {
      active: this.tempTask.priority === priority,
    };
  }

  loadCategories() {
    const url = `${environment.baseUrl}/categories/`;
    this.http.get(url).subscribe({
      next: (response: any) => {
        this.categories = response; // Assume response is an array of categories
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }
}
