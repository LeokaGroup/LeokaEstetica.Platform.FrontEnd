import { ChangeDetectorRef, Component, ElementRef, ViewChild, effect, input, model } from '@angular/core';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-chips',
  // standalone: true,
  // imports: [],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss'
})
/**
* Класс выбора элементов из списока доступнык в виде чипсов с попапом.
* @param allItems - массив доступных элементы для добавления.
* @param selectedItems - массив выбранных элементов.
* @param fieldName - названия поля в элементе для отображения в списке.
* @param placeholder - плейсхолдер поиска.
* 
* @return selectedItems - массив выбранных элементов.
*/
export class ChipsComponent {
  allItems = input<{}[]>([]);
  selectedItems = model<{}[]>([]);
  fieldName = input<string>('');
  placeholder = input<string>('Поиск...');

  gotData = false;
  availbleItems: any[] = [];
  selected: string | null = null;
  filtered: any[] = [];
  @ViewChild('autocomplete') element: ElementRef | undefined;

  constructor(private readonly _cd: ChangeDetectorRef) {
    effect(()=> {
      if (!this.gotData && this.allItems().length > 0) {
        this.gotData = true;
        this.availbleItems = [...this.allItems()];
      }
    });
  }

  /**
  * Функция убирает элемент из выбранных и добавляет его в список доступнык.
  * @param removedValue - Объект навыка.
  */
  onRemove(removedValue: any) {
    this.availbleItems = [...this.availbleItems, removedValue];
    const tmpArr = this.selectedItems().filter(
      (item: any) => item[this.fieldName()] !== removedValue[this.fieldName()]
    );
    this.selectedItems.set([]);
    this.selected = '';
    this._cd.detectChanges();
    this.selectedItems.set(tmpArr);
  };

  /**
   * Функция получает название элемента списка.
   * @param item - элемент списка.
  */
  getLabel(item: any) {
    if (this.fieldName() in item) {
      return item[this.fieldName()];
    }
    return null;
  }

  /**
   * Функция добавляет элемент в выбранные и убирает его из списка доступнык.
   * @param addValue - Объект навыка.
  */
  onAdd(addValue: any) {
    this.selectedItems.set([...this.selectedItems(), addValue.value]);
    this.availbleItems = this.availbleItems.filter(
      (item: any) => item[this.fieldName()] !== addValue.value[this.fieldName()]
    );
    this.selected = '';
  };

  /**
   * Функция фильтра списка.
   * @param $event - событие поиска.
  */
  filter($event: AutoCompleteCompleteEvent) {
    const query = $event.query.toLowerCase();
    this.filtered = this.availbleItems.filter(
      (item: any) => item[this.fieldName()].toLowerCase().indexOf(query) !== -1
    );
  }

  /**
   * Функция очистки поля поиска и установки фокуса.
   * @param $event - событие поиска.
  */
  clear() {
    const elem: any = this.element;
    if (elem?.inputEL.nativeElement) {
      (elem?.inputEL.nativeElement as HTMLInputElement).focus();
    }
    this.selected = null;
    this._cd.detectChanges();
    this.selected = '';
  }
}
