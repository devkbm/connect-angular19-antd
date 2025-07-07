import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalProperty {

    //static serverUrl: string = "https://localhost:8090";          // 로컬 테스트용
    //static serverUrl: string = "https://158.180.86.87:8090";        // 오라클 클라우드
    static serverUrl: string = "https://connect-one.zapto.org";

    //public static serverUrl: string = "http://kbm0417.gonetis.com:8090";

}
