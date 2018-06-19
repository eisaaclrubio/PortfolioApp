import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';

import { ChatService } from './services/chat.service';
import { MousewheelDirective } from './mousewheel.directive';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    MousewheelDirective
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    Angular2FontawesomeModule,
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [ ChatService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
