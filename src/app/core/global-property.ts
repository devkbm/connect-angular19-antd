import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalProperty {

    static serverUrl: string = "https://localhost:8090";
    //static serverUrl: string = "https://172.27.26.117:8090";

    //public static serverUrl: string = "http://kbm0417.gonetis.com:8090";
}
