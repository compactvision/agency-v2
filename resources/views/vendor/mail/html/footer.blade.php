<tr>
    <td class="footer">
        <table class="footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td class="content-cell" align="center">
                    {{ Illuminate\Mail\Markdown::parse($slot) }}
                    <p style="font-size: 10px; color: #94a3b8; margin-top: 10px;">
                        {{ __('mail.footer.confidentiality') }}
                    </p>
                </td>
            </tr>
        </table>
    </td>
</tr>
