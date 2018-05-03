import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  hiddenStart: string;
  hiddenConversation: string;

  constructor() { }

  ngOnInit() {
    this.hiddenStart = '';
    this.hiddenConversation = 'is-visible';
  }

  hide(){
    this.hiddenStart = '';
    this.hiddenConversation = 'is-visible';
  }

  open(){
    this.hiddenStart = 'is-visible';
    this.hiddenConversation = '';
  }
}
