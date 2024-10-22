import { Component } from '@angular/core';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})

/**
 * Класс компонента футера.
 */
export class FooterComponent {
  currentDate = new Date();

  menuItems = {
    services: [
      { link: '/vacancies', label: 'Вакансии' },
      { link: '/resumes', label: 'База резюме' },
      { link: '/projects', label: 'Проекты' },
    ],
    info: [
      {
        label: 'Частые вопросы',
        hash: '#faq-container',
      },
      { link: '/press/contacts', label: 'Контакты' },
      { link: '/press/offer', label: 'Публичная оферта' },
    ],
    support: [{ link: '/profile/tickets', label: 'Служба поддержки' }],
    social: [
      {
        link: 'https://t.me/leoka_estetica',
        label: 'Telegram',
        imgSrc: '/assets/images/logo/telegram.png',
      },
      {
        link: 'https://vk.com/leokaestetica',
        label: 'VK',
        imgSrc: '/assets/images/logo/vk.png',
      },
    ],
  };
}
