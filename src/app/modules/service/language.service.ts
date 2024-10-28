import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject: BehaviorSubject<string>
  currentLang$: Observable<string>

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('language') || 'vi'
    this.currentLangSubject = new BehaviorSubject<string>(savedLang)
    this.currentLang$ = this.currentLangSubject.asObservable()
    
    this.translate.setDefaultLang('vi')
    this.translate.use(savedLang)
  }

  switchLanguage(lang: string) {
    this.currentLangSubject.next(lang)
    localStorage.setItem('language', lang)
    this.translate.use(lang)
  }
  
}
