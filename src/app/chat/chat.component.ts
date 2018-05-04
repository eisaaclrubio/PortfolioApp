import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messageForm: FormGroup;
  hiddenStart: string;
  hiddenConversation: string;
  messages: Array<any>;
  someText: string;

  constructor() { 
    this.messageForm = new FormGroup({
      'message': new FormControl()
    });
  }

  ngOnInit() {
    this.someText = '';
    this.hiddenStart = '';
    this.hiddenConversation = 'is-visible';
    this.messages = [
      { message: "Hey hello how are you?", user: 'Isaac'},
      { message: "Hey fine thanks, and you?", user: 'Person'},
      { message: "Oh I'm great thanks for asking", user: 'Isaac'},
      { message: "I was wondering, is there something i can do for you?", user: 'Isaac'},
      { message: "Oh no everything is great, thanks", user: 'Person'},
    ];
    this.update();
  }

  update() {
    for(let chat=0; chat<this.messages.length-1; chat++){
      this.messages[chat].isLast = this.messages[chat].user == this.messages[chat+1].user ? false : true;
    }
    this.messages[this.messages.length-1].isLast = true;
  }

  onSubmit() {
    if(this.messageForm.value.message.length>0){
      this.messages.push({message: this.messageForm.value.message, user: 'Isaac'});
      this.someText = '';
      this.update();
      setTimeout(() => {
        let element = document.getElementById('feed');
        element.scrollTop = element.scrollHeight;
      }, 50);
    }
  }

  hide(){
    this.hiddenStart = '';
    this.hiddenConversation = 'is-visible';
  }

  open(){
    this.hiddenStart = 'is-visible';
    this.hiddenConversation = '';
    let element = document.getElementById('feed');
    element.scrollTop = element.scrollHeight;
  }
}
