<tr>
    <td class="footer">
        <table class="footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td class="content-cell" align="center">
                    {{ Illuminate\Mail\Markdown::parse($slot) }}
                    <p>&copy; {{ date('Y') }} {{ config('app.name') }}. Tous droits réservés.</p>
                    <p style="font-size: 10px; color: #94a3b8; margin-top: 10px;">
                        Cette communication est destinée à l'usage exclusif de son destinataire.
                    </p>
                </td>
            </tr>
        </table>
    </td>
</tr>