import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  tasks: any = [];
  error: string = '';
  constructor(private http: HttpClient) {}

  async ngOnInit() {
    try {
      this.tasks = await this.loadTasks();
      console.log(this.tasks);
    } catch (error) {
      this.error = 'fehler beim laden';
    }
  }

  loadTasks() {
    const url = environment.baseUrl + '/tasks/';
    return lastValueFrom(this.http.get(url));
  }
}
