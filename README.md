DialogWall
=============

A React component which provides dialog management service.

#### Goals

- Make showing modal dialogs easy.
- Provide very basic built-in dialog feature.


## Preparation

Place `<DialgWall>` as a HOC.

```typescript jsx
ReactDOM.render(
    <React.StrictMode>
        <DialogWall>
            <Page />
        </DialogWall>
    </React.StrictMode>,
    document.getElementById('root')
);
```

## Use Built-in Dialog

```typescript jsx
import { useDialog } from 'DialogWall';

const Page: React.FC = () => {
    const dialog = useDialog();
    const onClick: MouseEventHandler = (e) => {
        dialog
            .builder()
            .setPositiveButtonLabel('Go')
            .setNegativeButtonLabel('Never')
            .setMessage('Hello World')
            .setCallback((reason) => console.log(reason))
            .build();
    };
    return (
        <div>
            <button onClick={}>Show built-in dialog</button>
        </div>
    );
}
```

## Use Custom Dialog

```typescript jsx
import { DialogComponent, useDialog } from 'DialogWall';

const CustomDialog: DialogComponent = (props) => {
    const onClick: MouseEventHandler = (e) => props.close('Closed');
    return (
        <div>
            <button onClick={onClick} data-testid="close-button">Close</button>
        </div>
    );
};

const Page: React.FC = () => {
    const dialog = useDialog();
    const onClick: MouseEventHandler = (e) => {
        dialog
            dialog.show({
                component: CustomDialog,
                onClose: (reason) => console.log(reason),
            });
    };
    return (
        <div>
            <button onClick={}>Show custome dialog</button>
        </div>
    );
}
```

## Licence

MIT  

