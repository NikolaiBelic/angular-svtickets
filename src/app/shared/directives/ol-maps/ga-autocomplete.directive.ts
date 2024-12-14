import { Directive, ElementRef, inject, output, afterNextRender } from '@angular/core';
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import { SearchResult } from '../../interfaces/search-result';

@Directive({
  selector: 'ga-autocomplete',
  standalone: true,
  host: {
    'style': `
      z-index: 1;
      display: block;
      position: absolute;
      top: 20px;
      right: 20px;
      width: 50%;
      background-color: transparent;
    `
  }
})
export class GaAutocompleteDirective {
  #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  #autoComplete!: GeocoderAutocomplete;
  locationChange = output<SearchResult>();

  constructor() {
    afterNextRender(() => {
      this.#autoComplete = new GeocoderAutocomplete(
        this.#elementRef.nativeElement,
        "42c7710f83bc41698b841fec7a3b5d2d",
        { lang: "es" , debounceDelay: 600}
      );

      this.#autoComplete.on("select", (location) => {
        this.locationChange.emit({
          coordinates: location.geometry.coordinates,
          address: location.properties.formatted
        });
      });
    });
  }

}