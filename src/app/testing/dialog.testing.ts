import { of } from 'rxjs';

export class MatDialogTesting {
  open() {
   return {
     afterClosed: () => of(true)
   };
 }
}