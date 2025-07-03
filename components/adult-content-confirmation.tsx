"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Shield } from "lucide-react"
import { useAdultContent } from "@/lib/adult-content-context"

interface AdultContentConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
}

export function AdultContentConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title = "Conteúdo Adulto",
}: AdultContentConfirmationProps) {
  const [rememberChoice, setRememberChoice] = useState(false)
  const { enableAdultContent } = useAdultContent()

  const handleConfirm = () => {
    if (rememberChoice) {
      enableAdultContent()
    }
    onConfirm()
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-left">
            Este mangá contém conteúdo adulto/pornográfico. Você deve ter pelo menos 18 anos para visualizar este conteúdo.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-muted-foreground">
              Ao continuar, você confirma que tem 18 anos ou mais
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberChoice}
              onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Lembrar minha escolha e não perguntar novamente
            </label>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
            Confirmar (18+)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
