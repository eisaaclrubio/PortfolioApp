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
export class ChatComponent implements OnInit {
  feedObservable: Observable<ChatMessage[]> | any;
  @ViewChild('message') messageFocus: ElementRef;
  feedEelement: any;
  messageForm: FormGroup;
  emailForm: FormGroup;
  hiddenStart: boolean;
  hiddenConversation: boolean;
  authorized: boolean;
  emailSubmit: boolean;
  messages: Array<any>;
  someText: string;
  settedUp: boolean;
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
    this.authorized = false;
    this.hiddenStart = true;
    this.settedUp = false;
    this.hiddenConversation = true;
    this.emailSubmit = true;
    this.setUp();
  }

  getMessages() {
    this.chat.getMessages().valueChanges().subscribe((snaps) => {
      if(snaps.length > 0){
        for(let i=0; i<snaps.length-1; i++){
          snaps[i]['isLast'] = snaps[i]['user'] == snaps[i+1]['user'] ? false : true;
        }
        snaps[snaps.length-1]['isLast'] = true;
        this.feedObservable = Observable.of(snaps);
        this.updateScroll();
      }
    });
  }

  onSubmit() {
    this.chat.sendMessage(this.messageForm.value.message);
    this.someText = '';
    this.messageFocus.nativeElement.focus();
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

  updateScroll() {
    let element = document.getElementById('feed');
    element.scrollTop = element.scrollHeight;
  }

  setUp(){
    this.hiddenStart = true;
    this.chat.isAuth().subscribe((auth) => {
      if (auth !== undefined && auth !== null && this.settedUp) {
        this.authorized = true;
        this.getMessages();
      } else if(auth !== undefined && auth !== null){
        this.authorized = true;
        this.hiddenStart = false;
        this.getMessages();
      } else {
        this.hiddenStart = false;
      }
      this.settedUp = true;
    });
  }

  open(){
    if(this.authorized){
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
