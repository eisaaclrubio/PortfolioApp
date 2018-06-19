import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat-message.model';

@Injectable()
export class ChatService {
  user: any;
  chatMessages: AngularFireList<ChatMessage>;
  chatMessage: ChatMessage;
  userName: string;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) { 
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth.email;
      } else {
        this.user = null;
      }
    });
  }

  logInUser(email: string): Promise<any> {
    let password = 'someReallyReallyHardPassword12e12364352';
    this.user = email;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  createUser(email: string): Promise<any> {
    let password = 'someReallyReallyHardPassword12e12364352';
    this.user = email;
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  sendMessage(msg: string) {
    const timestamp = this.getTimeStamp();
    this.chatMessages = this.getMessages();
    if(this.user == null){
      return;
    }
    this.chatMessages.push({
      message: msg,
      isLast: false,
      timeSent: timestamp,
      user: this.user.split('@')[0],
      email: this.user
    });
  }

  isAuth(): Observable<any> {
    return this.afAuth.authState;
  }

  getTimeStamp() {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
                 (now.getUTCMonth() + 1) + '/' +
                 now.getUTCDay();
    const time = now.getUTCHours() + ':' +
                 now.getUTCMinutes() + ':' +
                 now.getUTCSeconds();
    return (date + ' ' + time);
  }

  getMessages(): AngularFireList<ChatMessage> {
    return this.db.list('/messages/' + this.afAuth.auth.currentUser.uid, ref => ref.limitToLast(25));
  }
}
