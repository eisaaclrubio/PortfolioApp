import { Component, OnInit, HostListener, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  width: number;
  height: number;
  position: number;
  top: Array<string> = ["", "", "", "", "", "", ""];
  icon: Array<string> = ["fa-circle-o", "fa-circle-o", "fa-circle-o",
  "fa-circle-o", "fa-circle-o"];
  IDs: Array<string> = ["Summary", "Experience", "Projects", "Resume", "ContactMe"];
  @ViewChild("Summary") Summary: ElementRef;
  @ViewChild("Experience") Experience: ElementRef;
  @ViewChild("Projects") Projects: ElementRef;
  @ViewChild("Resume") Resume: ElementRef;
  @ViewChild("ContactMe") ContactMe: ElementRef;
  Sections: Array<any>[5];
  Positions: Array<number> = [0,0,0,0,0];
  active: Array<string> = ["", "", "", "", ""];

  ngOnInit() {
    this.width = window.screen.width;
    this.height = window.screen.height;
    this.Sections = [this.Summary, this.Experience, this.Projects, this.Resume, this.ContactMe];
    this.drawSidebar(this.width, this.height);
  }

  ngAfterViewInit() {
    for( let section in this.Sections){
      this.Positions[section] = this.Sections[section].nativeElement.offsetTop;
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
    for( let section in this.Sections){
      this.Positions[section] = this.Sections[section].nativeElement.offsetTop;
    }
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.position = window.pageYOffset;
    for( let p in this.Positions ) {
      if(this.Positions[p] <= this.position) {
        this.icon = ["fa-circle-o", "fa-circle-o", "fa-circle-o",
        "fa-circle-o", "fa-circle-o"];
        this.active = ["", "", "", "", ""];
        this.icon[p] = "fa-circle";
        this.active[p] = "circle";
      } else if (this.position === 0) {
        this.icon = ["fa-circle-o", "fa-circle-o", "fa-circle-o",
        "fa-circle-o", "fa-circle-o"];
        this.active = ["", "", "", "", ""];
      }
    }
  }
}
