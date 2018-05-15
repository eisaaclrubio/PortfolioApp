import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { AngularFireList } from "angularfire2/database";
import { ChatMessage } from '../models/chat-message.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss', './chat.component.mobile.scss']
})
export class ChatComponent implements OnInit, OnChanges {
  tone = new Audio();
  feedObservable: Observable<ChatMessage[]> | any;
  @ViewChild('message') messageFocus: ElementRef;
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
    this.tone.src = 'https://www.soundjay.com/button/button-09.wav';
    this.tone.load();
    this.someText = '';
    this.email = '';
    this.hiddenStart = true;
    this.hiddenConversation = true;
    this.emailSubmit = true;
    this.setUp();
  }

  ngOnChanges() {
    this.getMessages();
    let element = document.getElementById('feed');
    element.scrollTop = element.scrollHeight;
  }

  getMessages() {
    this.chat.getMessages().valueChanges().subscribe((snaps) => {
      this.getAsyncMessages(snaps).then((feed) => {
        let temp : Observable<ChatMessage[]> | any = feed;
        let elements = temp.value;
        for(let i=0; i<elements.length-1; i++){
          elements[i]['isLast'] = elements[i]['user'] == elements[i+1]['user'] ? false : true;
        }
        elements[elements.length-1]['isLast'] = true;
        elements[elements.length-1]['user'] == 'Isaac' ? this.playTone() : null;
        temp.value = elements;
        this.feedObservable = temp;
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
    this.messageFocus.nativeElement.focus();
  }

  playTone(){
    this.tone.play();
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

  setUp(){
    setTimeout(() => {
      this.hiddenStart = false;
      this.open();
      setTimeout(() => {
        this.hide();
      }, 10);
    }, 2000);
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
