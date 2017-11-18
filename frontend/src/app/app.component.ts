import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Not yet connected to API';

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient
        .get(environment.apiUrl)
        .subscribe(data => {
          this.title = data['message'];
    });
  }
}
