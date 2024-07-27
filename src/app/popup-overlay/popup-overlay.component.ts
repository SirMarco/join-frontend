import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-overlay.component.html',
  styleUrl: './popup-overlay.component.scss',
})
export class PopupOverlayComponent {
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
