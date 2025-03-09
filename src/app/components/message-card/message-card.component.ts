import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MessageCardOptions } from '../../types/message-card.types';

@Component({
  selector: 'app-message-card',
  imports: [MatCardModule],
  templateUrl: './message-card.component.html',
  styleUrl: './message-card.component.css'
})
export class MessageCardComponent {
  @Input({ required: true }) options!: MessageCardOptions | null;
}
