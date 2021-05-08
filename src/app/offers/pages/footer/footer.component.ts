import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  goToLink() {
    window.open(
      'https://www.linkedin.com/in/joseph-mauricio-gutierrez-valero-3b930512b',
      '_blank'
    );
  }
}
