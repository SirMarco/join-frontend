import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.scss'],
})
export class NoteDialogComponent implements OnInit {
  @Output() closeDialog = new EventEmitter<void>();

  open = true;

  ngOnInit() {
    setTimeout(() => {
      this.onClose();
    }, 1000);
  }

  onClose() {
    this.open = false;
    setTimeout(() => {
      this.closeDialog.emit();
    }, 300);
  }
}
