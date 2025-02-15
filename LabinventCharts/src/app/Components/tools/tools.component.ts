import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { Subscription } from 'rxjs';
import {
  selectSelectedFile,
  setFilterLetter,
  setIsRemoveZeroValues,
} from '../../Redux';
import { ValidData } from '../../Interfaces';

@Component({
  selector: 'app-tools',
  imports: [CheckboxModule, SelectModule],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsComponent implements OnInit, OnDestroy {
  private storeDataSubscription: Subscription | null = null;
  constructor(
    private store: Store,
    private cdRef: ChangeDetectorRef,
  ) {}

  options: { id: string; label: string }[] = [];

  setFilterLetter(event: SelectChangeEvent) {
    if (!event.value) {
      this.store.dispatch(setFilterLetter({ value: '' }));
      return;
    }
    this.store.dispatch(setFilterLetter({ value: event.value.id }));
  }

  toggleMinValues(event: CheckboxChangeEvent) {
    const isChecked = event.checked;
    this.store.dispatch(setIsRemoveZeroValues({ value: isChecked }));
  }

  private calculateOptions(chartData: ValidData[] | undefined) {
    if (!chartData) {
      return;
    }
    const firstLetterMap: Record<string, string> = {};
    chartData.forEach((el) => {
      const character = el.category.toString().toLowerCase()[0];
      firstLetterMap[character] = character.toUpperCase();
    });
    this.options = Object.entries(firstLetterMap)
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  ngOnInit() {
    this.storeDataSubscription = this.store
      .select(selectSelectedFile)
      .subscribe((selectedFile) => {
        this.calculateOptions(selectedFile?.fileContent);
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.storeDataSubscription?.unsubscribe();
  }
}
