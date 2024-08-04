import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class TaskDialogComponent {
  @Input() task: any;
  @Input() userNames: string[] = [];
  @Output() closeDialog = new EventEmitter<void>();
  @Output() taskDeleted = new EventEmitter<number>();

  editMode = false;
  selectedPriority: string = '';
  constructor(private http: HttpClient) {}

  onClose() {
    this.closeDialog.emit();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  saveChanges() {
    const url = `${environment.baseUrl}/tasks/${this.task.id}/`;
    this.http.put(url, this.task).subscribe({
      next: (response) => {
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
    this.task.priority = priority;
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
      active: this.task.priority === priority,
    };
  }
}
