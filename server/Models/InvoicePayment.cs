using System;
using System.Collections.Generic;

namespace server.Models;

/// <summary>
/// Table that stores all the payments made to an invoice by the customer
/// </summary>
public partial class InvoicePayment
{
    public long Id { get; set; }

    public long? InvoiceId { get; set; }

    public string? PaymentMethod { get; set; }

    public double? Amount { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    /// <summary>
    /// The date when company has received payment for a invoice
    /// </summary>
    public DateOnly? DateReceived { get; set; }

    public virtual Invoice? Invoice { get; set; }
}
