import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseList } from 'src/app/core/model/response-list';
import { DataService } from 'src/app/core/service/data.service';
import { BoardHierarchy } from './board-hierarchy.model';

@Injectable({
  providedIn: 'root'
})
export class BoardHierarcyService extends DataService {

  constructor() {
    super('/api/grw');
  }

  getBoardHierarchy(): Observable<ResponseList<BoardHierarchy>> {
    const url = `${this.API_URL}/boardHierarchy`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseList<BoardHierarchy>>(url, options)
      .pipe(
        //catchError((err) => Observable.throw(err))
      );
  }
}
