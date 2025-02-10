import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { setIsRemoveZeroValues } from '../../Redux/files-store.actions';
import { SelectChangeEvent, SelectModule } from 'primeng/select';

@Component({
  selector: 'app-tools',
  imports: [CheckboxModule, SelectModule],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsComponent {
  constructor(private store: Store) {}

  alphabet: string[] = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];

  setFilterValue(event: SelectChangeEvent) {
    console.log(event.value);
  }

  toggleZeroValues(event: CheckboxChangeEvent) {
    const isChecked = event.checked;
    this.store.dispatch(setIsRemoveZeroValues({ value: isChecked }));
  }
}
