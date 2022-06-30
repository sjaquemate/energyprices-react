import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

interface OverOnsDialogProps {
  isOpen: boolean
  closeDialog: () => void
}
export function OverOnsDialog(props: OverOnsDialogProps) {
  return (
    <Dialog onClose={props.closeDialog} open={props.isOpen}>
      {/* <DialogTitle>Set backup account</DialogTitle> */}
      <div className="p-5 bg-teal-50">
        <div className="text-3xl text-center"> over ons</div>
        <div className="mt-10 flex flex-col gap-5 text-center">
          <div>
            Variabeltarief.com wil het kiezen van een variabel energiecontract makkelijk, transparant en eerlijk houden.
            Daarom plaatsen wij geen advertenties of andere tijdelijke aanbiedingen.
          </div>
          <div>
            De prijzen en tarieven worden dagelijks geüpdate.
          </div>
          <div>
            Heb je een vraag? Stuur een mailtje naar info@variabeltarief.com
          </div>

        </div>
      </div>
    </Dialog>
  )
}