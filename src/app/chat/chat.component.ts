import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { AngularFireList } from "angularfire2/database";
import { ChatMessage } from '../models/chat-message.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnChanges {
  feedObservable: Observable<ChatMessage[]> | any;
  messageForm: FormGroup;
  emailForm: FormGroup;
  hiddenStart: boolean;
  hiddenConversation: boolean;
  emailSubmit: boolean;
  messages: Array<any>;
  someText: string;
  email: string;

  constructor( private chat: ChatService ) { 
    this.messageForm = new FormGroup({
      'message': new FormControl()
    });
    this.emailForm = new FormGroup({
      'email': new FormControl()
    });
  }

  ngOnInit() {
    this.someText = '';
    this.email = '';
    this.hiddenStart = false;
    this.hiddenConversation = true;
    this.emailSubmit = true;
  }

  ngOnChanges() {
    this.getMessages();
  }

  getMessages() {
    this.chat.getMessages().valueChanges().subscribe((snaps) => {
      this.getAsyncMessages(snaps).then((feed) => {
        this.feedObservable = feed;
        let element = document.getElementById('feed');
        element.scrollTop = element.scrollHeight;
      })
    });
  }

  getAsyncMessages(feed: ChatMessage[]) {
    return new Promise((resolve, reject) => {
      resolve(Observable.of(feed));
      reject('Error');
    });
  }

  onSubmit() {
    this.chat.sendMessage(this.messageForm.value.message);
    this.someText = '';
    this.getMessages();
  }

  submitEmail() {
    this.chat.createUser(this.emailForm.value.email).then(fireUser => {
      this.hiddenStart = true;
      this.emailSubmit = true;
      this.hiddenConversation = false;
      this.getMessages();
    }).catch(err => {
      this.chat.logInUser(this.emailForm.value.email).then(User => {
        this.hiddenStart = true;
        this.emailSubmit = true;
        this.hiddenConversation = false;
        this.getMessages();
      }).catch(err => {
        console.log(err);
      })
    })
  }

  hide(){
    this.hiddenStart = false;
    this.emailSubmit = true;
    this.hiddenConversation = true;
  }

  open(){
    if(this.chat.isAuth()){
      this.hiddenStart = true;
      this.emailSubmit = true;
      this.hiddenConversation = false;
      this.getMessages();
    } else {
      this.hiddenStart = true;
      this.emailSubmit = false;
      this.hiddenConversation = true;
    }
  }
}
