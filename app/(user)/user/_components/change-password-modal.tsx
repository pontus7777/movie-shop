import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogFooter, Dialog, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

/* -------------------------------------------------------
   CHANGE PASSWORD MODAL
------------------------------------------------------- */
export default function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSave() {
        // validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all fields')
            return
        }
        if (newPassword.length < 8) {
            toast.error('New password must be at least 8 characters')
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match")
            return
        }

        setLoading(true)
        try {
            const result = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true, // ★ signs out all other devices on password change
            })

            if (result.error) {
                toast.error(result.error.message ?? 'Failed to change password')
                return
            }

            toast.success('Password changed successfully')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            onClose()
        } catch {
            toast.error('Failed to change password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Current password</label>
                        <Input
                            type="password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">New password</label>
                        <Input
                            type="password"
                            placeholder="At least 8 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Confirm new password</label>
                        <Input
                            type="password"
                            placeholder="Repeat new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Change password'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}