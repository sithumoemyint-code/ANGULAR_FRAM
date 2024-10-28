import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class MenuTranslationService {

  constructor(private translate: TranslateService) {}

  getTranslatedMenuItems(): Observable<any> {
    return this.translate.get([
      'SIDE_NAV_BAR.ADMINS',
      'SIDE_NAV_BAR.ROLE',
      'SIDE_NAV_BAR.ADMIN_ACCOUNT',
      'SIDE_NAV_BAR.UI_MANAGEMENT',
      'SIDE_NAV_BAR.BANNER_MANAGEMENT',
      'SIDE_NAV_BAR.NOTIFICATION',
      'SIDE_NAV_BAR.ICON',
      'SIDE_NAV_BAR.COMMON_NOTIFICATION',
      'SIDE_NAV_BAR.HISTORY_NOTIFICATION',
      'SIDE_NAV_BAR.MANAGEMENT_CUSTOMER_ACCOUNT',
      'SIDE_NAV_BAR.MANAGEMENT_CONTRACT',
      'SIDE_NAV_BAR.REQUEST_CONTRACTS',
      'SIDE_NAV_BAR.CONTRACT_LIST',
      'SIDE_NAV_BAR.MANAGEMENT_PACKAGE',
      'SIDE_NAV_BAR.MANAGEMENT_NEWS',
      'SIDE_NAV_BAR.NEWS',
      'SIDE_NAV_BAR.FEEDBACKS_SUGGESTIONS',
      'SIDE_NAV_BAR.CONTACT_INFORMATION',
      'SIDE_NAV_BAR.USER_FEEDBACKS'
    ]).pipe(
      map(translations => {
        return {
          admins: translations['SIDE_NAV_BAR.ADMINS'],
          role: translations['SIDE_NAV_BAR.ROLE'],
          adminAccount: translations['SIDE_NAV_BAR.ADMIN_ACCOUNT'],
          uiManagement: translations['SIDE_NAV_BAR.UI_MANAGEMENT'],
          bannerManagement: translations['SIDE_NAV_BAR.BANNER_MANAGEMENT'],
          notification: translations['SIDE_NAV_BAR.NOTIFICATION'],
          icon: translations['SIDE_NAV_BAR.ICON'],
          commonNotification: translations['SIDE_NAV_BAR.COMMON_NOTIFICATION'],
          historyNotification: translations['SIDE_NAV_BAR.HISTORY_NOTIFICATION'],
          managementCustomerAccount: translations['SIDE_NAV_BAR.MANAGEMENT_CUSTOMER_ACCOUNT'],
          managementContract: translations['SIDE_NAV_BAR.MANAGEMENT_CONTRACT'],
          requestContracts: translations['SIDE_NAV_BAR.REQUEST_CONTRACTS'],
          contractList: translations['SIDE_NAV_BAR.CONTRACT_LIST'],
          managementPackage: translations['SIDE_NAV_BAR.MANAGEMENT_PACKAGE'],
          managementNews: translations['SIDE_NAV_BAR.MANAGEMENT_NEWS'],
          news: translations['SIDE_NAV_BAR.NEWS'],
          feedbackSuggestions: translations['SIDE_NAV_BAR.FEEDBACKS_SUGGESTIONS'],
          contactInformation: translations['SIDE_NAV_BAR.CONTACT_INFORMATION'],
          userFeedbacks: translations['SIDE_NAV_BAR.USER_FEEDBACKS'],
        }
      })
    )
  }

  onLanguageChange(): Observable<any> {
    return this.translate.onLangChange.pipe(
      map(() => {
        return this.getTranslatedMenuItems() // Re-fetch translations when language changes
      })
    )
  }
}
