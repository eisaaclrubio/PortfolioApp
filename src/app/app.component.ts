import { Component, OnInit, HostListener, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './app.component.mobile.scss']
})
export class AppComponent implements OnInit {
  background = new Image();
  scrolling: boolean;
  title = 'app';
  Over = false;
  topSingle: string = "top[0]";
  width: number;
  height: number;
  position: number;
  top: Array<string> = ["", "", "", "", "", ""];
  icon: Array<string> = ["fa-circle-o", "fa-circle-o", "fa-circle-o",
  "fa-circle-o"];
  idIndex: Array<number> = [0, 1, 2, 3];
  IDs: Array<string> = ["Summary", "Experience", "Projects", "ContactMe"];
  Tag: string = "";
  @ViewChild("Summary") Summary: ElementRef;
  @ViewChild("Experience") Experience: ElementRef;
  @ViewChild("Projects") Projects: ElementRef;
  @ViewChild("ContactMe") ContactMe: ElementRef;
  Sections: Array<any>[4];
  Positions: Array<number> = [0,0,0,0];
  active: Array<string> = ["", "", "", "", ""];

  ngOnInit() {
    this.scrolling = false;
    this.background.src = '/assets/clint-mckoy-463797.jpg';
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.Sections = [this.Summary, this.Experience, this.Projects, this.ContactMe];
    this.drawSidebar(this.width, this.height);
    this.background.onload = () => {
      let home = document.getElementById('home');
      home.style.background = 'url("/assets/clint-mckoy-463797.jpg") no-repeat center center fixed';
      home.style['background-size'] = 'cover';
    }
  }

  ngAfterViewInit() {
    document.onreadystatechange = () => {
      if (document.readyState == "complete") {
        for( let section in this.Sections){
          this.Positions[section] = this.Sections[section].nativeElement.offsetTop;
        }
      }
    }
  }

  drawSidebar(width: number, height: number) {
    let space = height/15;
    for( let icon in this.top ) {
      this.top[icon] = ((Number(icon)-1)*space)+(height/3) + "px";
    }
  }

  @HostListener("window:resize", [])
  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    for( let section in this.Sections){
      this.Positions[section] = this.Sections[section].nativeElement.offsetTop;
    }
    this.drawSidebar(this.width, this.height);
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.position = window.pageYOffset;
    for( let p in this.Positions ) {
      if(this.Positions[p] <= this.position) {
        this.icon = ["fa-circle-o", "fa-circle-o", "fa-circle-o",
        "fa-circle-o"];
        this.active = ["", "", "", ""];
        this.icon[p] = "fa-circle";
        this.active[p] = "circle";
      } else if (this.position === 0) {
        this.icon = ["fa-circle-o", "fa-circle-o", "fa-circle-o",
        "fa-circle-o"];
        this.active = ["", "", "", ""];
      }
    }
  }

  mouseWheelUpFunc() {
    if(this.icon.includes('fa-circle') && this.icon.indexOf('fa-circle') != 0) {
      if(!this.scrolling){
        this.scrolling = true;
        let place = this.icon.indexOf('fa-circle');
        this.icon[place] = 'fa-circle-o';
        this.icon[place-1] = 'fa-circle';
        this.click(place - 1);
      }
    } else {
      this.icon[0] = 'fa-circle-o';
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  }

  mouseWheelDownFunc() {
    if(this.icon.includes('fa-circle')) {
      let place = this.icon.indexOf('fa-circle');
      if(place != this.icon.length-1 && !this.scrolling) {
        this.scrolling = true;
        this.icon[place] = 'fa-circle-o';
        this.icon[place+1] = 'fa-circle';
        this.click(place + 1);
      }
    } else {
      let pos = this.Sections[0].nativeElement.offsetTop;
      window.scrollTo({ left: 0, top: pos, behavior: 'smooth' });
    }
  }

  mEnter(inx: number) {
    this.Over = true;
    this.Tag = this.IDs[inx];
    this.topSingle = this.top[inx]
  }

  mLeave() {
    this.Over = false;
  }

  smoothScroll(i: number, parts: number, current: number) {
    if (i <= 60) {
      if(i==60) this.scrolling = false;
      setTimeout(()=> {
        window.scrollTo(0, current+(parts*i));
        i++;
        this.smoothScroll(i, parts, current);
      },10);
    }
  }

  click(sec: number) {
    let pos = this.Sections[sec].nativeElement.offsetTop;
    let parts = (pos-window.pageYOffset)/60;
    let current = window.pageYOffset;
    let i = 1;
    this.smoothScroll(i, parts, current);
  }
}
