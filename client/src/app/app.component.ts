import type { IPerson } from '../types/persons';
import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import * as am5 from '@amcharts/amcharts5';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PersonsService } from '../service/persons.service';
import { finalize } from 'rxjs';
import { ObjectUtils } from '../utils';
import { CreateCrimeFormComponent } from './crime/create-crime-form.component';
import { PersonDetailsComponent } from './person/person-details.component';
import { CrimesTableComponent } from './crime/crimes-table-component';
import { PersonManager } from '../managers/person.manager';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    CreateCrimeFormComponent,
    CrimesTableComponent,
    PersonDetailsComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent extends PersonManager {
  private root!: am5.Root;
  public target: IPerson | null = null;

  constructor(
    personService: PersonsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private zone: NgZone
  ) {
    super(personService, () => this.initMap());
  }

  browserOnly(callback: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(callback);
    }
  }

  ngOnInit() {
    this.personService
      .list()
      .pipe(finalize(() => this.initMap()))
      .subscribe((data) => {
        this.persons = data;
      });
  }

  setTarget(person: IPerson) {
    this.target = person;
    const chart = this.root?.container.children.getIndex(0);
    if (chart instanceof am5map.MapChart) {
      const [latitude, longitude] = this.target.position
        .trim()
        .split(',')
        .map(Number);

      chart.zoomToGeoPoint({ latitude, longitude }, 10, true, 1000);
    }
  }

  initMap() {
    this.browserOnly(() => {
      const root = am5.Root.new('chartdiv');
      root._logo?.dispose();
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: 'rotateX',
          panY: 'translateY',
          minZoomLevel: 3,
          zoomLevel: 3,
          projection: am5map.geoMercator(),
        })
      );

      const backgroundSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {})
      );

      backgroundSeries.mapPolygons.template.setAll({
        fillOpacity: 0,
        strokeOpacity: 0,
      });

      backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180),
      });

      chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          fill: am5.Color.fromRGB(199, 15, 15),
        })
      );

      const lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
      lineSeries.mapLines.template.setAll({
        stroke: root.interfaceColors.get('alternativeBackground'),
        strokeOpacity: 0.3,
      });

      const pointSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {})
      );

      pointSeries.bullets.push(() => {
        const container = am5.Container.new(root, {
          tooltipText: '{title}',
          cursorOverStyle: 'pointer',
        });

        container.events.on('click', ({ target }) => {
          this.ngZone.run(() => {
            const context = target.dataItem?.dataContext;

            if (
              !ObjectUtils.isObject(context) ||
              !ObjectUtils.hasOwnProperty(context, 'personId')
            ) {
              return;
            }

            const newTarget = this.persons?.items.find(
              ({ id }) => id === context.personId
            );
            if (newTarget) this.setTarget(newTarget);
          });
        });

        const circle = container.children.push(
          am5.Circle.new(root, {
            radius: 4,
            tooltipY: 0,
            fill: am5.Color.fromRGB(255, 255, 255),
            strokeOpacity: 0,
          })
        );
        container.children.push(
          am5.Circle.new(root, {
            radius: 5,
            tooltipY: 0,
            fill: am5.Color.fromRGB(255, 255, 255),
            strokeOpacity: 0,
            tooltipText: '{title}',
          })
        );

        circle.animate({
          key: 'scale',
          from: 1,
          to: 3,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic),
          loops: Infinity,
        });
        circle.animate({
          key: 'opacity',
          from: 1,
          to: 0.1,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic),
          loops: Infinity,
        });

        return am5.Bullet.new(root, {
          sprite: container,
        });
      });

      if (this.persons) {
        for (const person of this.persons.items) {
          const [latitude, longitude] = person.position
            .trim()
            .split(',')
            .map(Number);

          pointSeries.data.push({
            personId: person.id,
            geometry: { type: 'Point', coordinates: [longitude, latitude] },
            title: `${person.first_name} ${person.last_name}`,
          });
        }
      }

      chart.appear(1000, 100);
      this.root = root;
    });
  }

  ngOnDestroy() {
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

  title = 'client';
}
