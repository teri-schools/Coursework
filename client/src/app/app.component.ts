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
    this.personService.list().subscribe((data) => {
      this.persons = data;
      this.initMap();
    });
  }

  initMap() {
    this.browserOnly(() => {
      if (this.persons === null) {
        throw new Error('Persons data is null');
      }

      const root = am5.Root.new('chartdiv');
      root._logo?.dispose();

      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([am5themes_Animated.new(root)]);

      // Create the map chart
      // https://www.amcharts.com/docs/v5/charts/map-chart/
      let chart = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: 'rotateX',
          panY: 'translateY',
          minZoomLevel: 3,
          zoomLevel: 3,
          projection: am5map.geoMercator(),
        })
      );

      let cont = chart.children.push(
        am5.Container.new(root, {
          layout: root.horizontalLayout,
          x: 20,
          y: 40,
        })
      );

      // Add labels and controls
      cont.children.push(
        am5.Label.new(root, {
          centerY: am5.p50,
          text: 'Map',
        })
      );

      let switchButton = cont.children.push(
        am5.Button.new(root, {
          themeTags: ['switch'],
          centerY: am5.p50,
          icon: am5.Circle.new(root, {
            themeTags: ['icon'],
          }),
        })
      );

      switchButton.on('active', function () {
        if (!switchButton.get('active')) {
          chart.set('projection', am5map.geoMercator());
          chart.set('panY', 'translateY');
          chart.set('rotationY', 0);
          backgroundSeries.mapPolygons.template.set('fillOpacity', 0);
        } else {
          chart.set('projection', am5map.geoOrthographic());
          chart.set('panY', 'rotateY');

          backgroundSeries.mapPolygons.template.set('fillOpacity', 0.1);
        }
      });

      cont.children.push(
        am5.Label.new(root, {
          centerY: am5.p50,
          text: 'Globe',
        })
      );

      // Create series for background fill
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
      let backgroundSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {})
      );
      backgroundSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get('alternativeBackground'),
        fillOpacity: 0,
        strokeOpacity: 0,
      });

      // Add background polygon
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
      backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180),
      });

      chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
        })
      );

      let lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
      lineSeries.mapLines.template.setAll({
        stroke: root.interfaceColors.get('alternativeBackground'),
        strokeOpacity: 0.3,
      });

      let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
      let colorset = am5.ColorSet.new(root, {});

      pointSeries.bullets.push(function () {
        let container = am5.Container.new(root, {
          tooltipText: '{title}',
          cursorOverStyle: 'pointer',
        });

        container.events.on('click', (e: any) => {
          window.location.href = e.target.dataItem.dataContext.url;
        });

        let circle = container.children.push(
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

      for (const person of this.persons.items) {
        const coords = AmchartsUtil.generateCoords();
        addPlace(coords.longitude, coords.latitude, `${person.first_name} ${person.last_name}`, person.id.toString());
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
