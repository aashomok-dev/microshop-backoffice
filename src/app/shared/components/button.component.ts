import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() className = '';
  @Input() centered = false; // 🔹 додає можливість центрувати

  get computedClass(): string {
    const baseClass = 'app-button';
    const classes = [baseClass];

    if (this.centered) classes.push('centered');
    if (this.className) classes.push(this.className);

    return classes.join(' ');
  }
}
