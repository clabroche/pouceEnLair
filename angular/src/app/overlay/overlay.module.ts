import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CltNotificationsService } from './providers/notifications.service';
import { CltNotificationsComponent } from './notifications/notifications.component';
import { CltPopupComponent, CltBodyDirective, CltTitleDirective } from './popup/popup.component';
import { CltSidePanelComponent } from './side-panel/side-panel.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CltNotificationsComponent,
    CltPopupComponent,
    CltBodyDirective,
    CltTitleDirective,
    CltSidePanelComponent,
  ],
  exports: [
    CltNotificationsComponent,
    CltPopupComponent,
    CltBodyDirective,
    CltTitleDirective,
    CltSidePanelComponent,
  ]
})
export class CltOverlayModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CltOverlayModule,
      providers: [
        CltNotificationsService,
      ]
    };
  }
}
