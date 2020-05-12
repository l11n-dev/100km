import {AfterViewInit, Component} from '@angular/core';
import { Map, tileLayer, circle as Lcircle, marker as Lmarker, icon as Licon } from 'leaflet';
import {NominatimResponse, NominatimService} from './services/nominatim.service';
import {Observable} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {ModalHelpPage} from './modal-help/modal-help.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  private map: Map;
  private textSearch: string;
  nominatimResponse$: Observable<NominatimResponse[]>;
  nominatimLocateResponse$: Observable<NominatimResponse[]>;
  private homeMarkers: Marker[] = [];
  locateSearch: string;
  locateMarker: Lmarker;

  constructor(private nominatim: NominatimService, private modalCtrl: ModalController) {}

  ngAfterViewInit() {
    this.map = new Map('map').setView([46.603354, 1.8883335], 6);
    this.map.on('locationfound', e => { this.onLocationFound(e); });
    this.map.on('locationerror', e => { this.onLocationError(e); });

    this.map.zoomControl.setPosition('bottomright');

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    // this.map.setZoom(8);

    setTimeout(args => this.map.invalidateSize() , 100); // Needed to fix tiles net being displayed until window is resized

    // this.map.locate({setView: true, maxZoom: 8});
  }

  onLocationFound(e) {
    this.displayLocation(new NominatimResponse(e.latlng[0], e.latlng[1], ''));
  }

  onLocationError(e) {
    console.log(e);
  }

  private addCircle(latitude: number, longitude: number): Lcircle {
    return Lcircle([latitude, longitude], {
      color: 'green',
      fillColor: '#2bff00',
      fillOpacity: 0.05,
      radius: 100000
    }).addTo(this.map);
  }


  onInput($event: CustomEvent) {
    this.nominatimResponse$ = this.nominatim.addressLookup(this.textSearch);
  }

  displayHomeLocation(homeLocation: NominatimResponse) {
    const homeIcon = Licon({
      iconUrl: '/svg/home-outline.svg',
      iconSize:     [38, 38]
    });
    const marker = Lmarker([homeLocation.latitude, homeLocation.longitude], {icon: homeIcon}).addTo(this.map);
    const circle = this.addCircle(homeLocation.latitude, homeLocation.longitude);
    this.map.setView([homeLocation.latitude, homeLocation.longitude], 8);
    this.nominatimResponse$ = null;
    this.textSearch = '';
    const newMarker = new Marker(marker, circle, homeLocation.displayName);
    this.homeMarkers.push(newMarker);
  }

  deleteHomeMaker(homeMarker: Marker) {
    homeMarker.marker.remove();
    homeMarker.circle.remove();
    this.homeMarkers.splice(this.homeMarkers.indexOf(homeMarker), 1);
  }

  onLocate($event: CustomEvent) {
    this.nominatimLocateResponse$ = this.nominatim.addressLookup(this.locateSearch);
  }

  displayLocation(location: NominatimResponse) {
    if (this.locateMarker) {
      this.locateMarker.remove();
    }
    this.locateMarker = Lmarker([location.latitude, location.longitude]).addTo(this.map);
    this.map.setView([location.latitude, location.longitude], 8);
    this.nominatimLocateResponse$ = null;
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalHelpPage,
      swipeToClose: true,
      presentingElement: await this.modalCtrl.getTop() // Get the top-most ion-modal
    });
    return await modal.present();
  }
}

export class Marker {
  constructor(
      public marker: Lmarker,
      public circle: Lcircle,
      public displayName: string
  ) {
  }
}
