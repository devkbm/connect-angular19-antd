import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalProperty {

    static serverUrl: string = "http://localhost:8090";
    //static serverUrl: string = "http://175.114.176.195:8090";

    //public static serverUrl: string = "http://kbm0417.gonetis.com:8090";
}
