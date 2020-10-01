import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDo } from '../_interface/todo';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private serverUrl = 'http://localhost:3000';

  constructor(
    // tslint:disable-next-line:variable-name
    private _http: HttpClient
  ) {  }

  // Get
  public getToDo(): Observable<ToDo[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.get<ToDo[]>(`${this.serverUrl}/todos`);
  }

  // Post
  public postToDo(object: ToDo): Observable<ToDo[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.post<ToDo[]>(`${this.serverUrl}/todos`, object, httpOptions);
  }

  // Delete
  public deleteToDo(object: ToDo): Observable<ToDo[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.delete<ToDo[]>(`${this.serverUrl}/todos/${object.id}`, httpOptions);
  }

  // Put
  public putToDo(object: ToDo): Observable<ToDo[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.put<ToDo[]>(`${this.serverUrl}/todos/${object.id}`, object, httpOptions);
  }

}
