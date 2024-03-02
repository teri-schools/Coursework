import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import * as am5 from '@amcharts/amcharts5';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PersonsService } from '../service/persons.service';
import { PaginatedData } from '../types';
import { IPerson } from '../types/persons';
import AmchartsUtil from '../utils/amcharts.util';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private root!: am5.Root;
  public persons: PaginatedData<IPerson> | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private personService: PersonsService,
    private zone: NgZone
  ) {}

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
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

      const container = chart.children.push(
        am5.Container.new(root, {
          layout: root.horizontalLayout,
          x: 20,
          y: 40,
        })
      );

      const backgroundSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {})
      );

      backgroundSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get('alternativeBackground'),
        fillOpacity: 0,
        strokeOpacity: 0,
      });

      backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180),
      });

      chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
        })
      );

      const lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
      lineSeries.mapLines.template.setAll({
        stroke: root.interfaceColors.get('alternativeBackground'),
        strokeOpacity: 0.3,
      });

      const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
      const colorset = am5.ColorSet.new(root, {});

      pointSeries.bullets.push(() => {
        const container = am5.Container.new(root, {
          tooltipText: '{title}',
          cursorOverStyle: 'pointer',
        });

        container.events.on('click', (e: any) => {
          window.location.href = e.target.dataItem.dataContext.url;
        });

        const circle = container.children.push(
          am5.Circle.new(root, {
            radius: 4,
            tooltipY: 0,
            fill: colorset.next(),
            strokeOpacity: 0,
          })
        );
        container.children.push(
          am5.Circle.new(root, {
            radius: 5,
            tooltipY: 0,
            fill: colorset.next(),
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
        console.log(this.persons.items[0]);
        for (const person of this.persons.items) {
          const [longitude, latitude] = person.position.trim().split(',').map(Number);
          addPlace(
            longitude,
            latitude,
            `${person.first_name} ${person.last_name}`,
            person.id.toString()
          );
        }
      }

      function addPlace(
        longitude: number,
        latitude: number,
        title: string,
        url: string
      ) {
        pointSeries.data.push({
          url: url,
          geometry: { type: 'Point', coordinates: [longitude, latitude] },
          title: title,
        });
      }

      // Make stuff animate on load
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
