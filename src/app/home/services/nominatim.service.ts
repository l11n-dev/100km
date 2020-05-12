import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NominatimService {

  constructor(private http: HttpClient) { }

  addressLookup(req?: string): Observable<NominatimResponse[]> {
    const url = `https://nominatim.100km.l11n.dev/search?q=${req}&format=json`;
    return this.http
        .get(url).pipe(
            map((data: any[]) => data.map((item: any) => new NominatimResponse(
                item.lat,
                item.lon,
                item.display_name
                ))
            )
        )
  }
}

export class NominatimResponse {
  constructor(
      public latitude: number,
      public longitude: number,
      public displayName: string
  ) {
  }
}
