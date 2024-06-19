using System;
using System.Collections.Generic;

namespace server.Models;

/// <summary>
/// Table that stores all the invoices.
/// </summary>
public partial class Invoice
{
    public long Id { get; set; }

    public long InvoiceNumber { get; set; }

    public long CustomerId { get; set; }

    public long? ServiceTypeId { get; set; }

    public long? InvoiceStatusId { get; set; }

    public DateOnly? InvoiceDate { get; set; }

    public DateOnly? IssueDate { get; set; }

    public DateOnly? DueDate { get; set; }

    public double? Subtotal { get; set; }

    public double? Total { get; set; }

    public string? SqftMeasurement { get; set; }

    public string? Note { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? BillFromStreetAddress { get; set; }

    public string? BillFromCity { get; set; }

    public string? BillFromZipcode { get; set; }

    public string? BillToStreetAddress { get; set; }

    public string? BillToCity { get; set; }

    public string? BillToState { get; set; }

    public string? BillToZipcode { get; set; }

    /// <summary>
    /// Note meant to be seen by the customer when we send out invoices to them.
    /// </summary>
    public string? CustNote { get; set; }

    public string? BillFromEmail { get; set; }

    public string? BillFromState { get; set; }

    /// <summary>
    /// The purpose of this column is to create a field to have where be used as the total due when we subtract total minus payment.
    /// </summary>
    public double? AmountDue { get; set; }

    /// <summary>
    /// Boolean Value to determine if to display custom billing info for customer
    /// </summary>
    public bool? BillTo { get; set; }

    public long? ConvertedFromQuoteNumber { get; set; }

    /// <summary>
    /// This will store internal notes for a invoice that is only visible internally and not the customer when it comes to exporting.
    /// </summary>
    public string? PrivateNote { get; set; }

    /// <summary>
    /// This is a public note that each invoice will have in order to display note to customer.
    /// </summary>
    public string? PublicNote { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<InvoiceLineService> InvoiceLineServices { get; set; } = new List<InvoiceLineService>();

    public virtual ICollection<InvoicePayment> InvoicePayments { get; set; } = new List<InvoicePayment>();

    public virtual InvoiceStatus? InvoiceStatus { get; set; }

    public virtual Service? ServiceType { get; set; }
}
