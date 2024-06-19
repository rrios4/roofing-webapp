using System;
using System.Collections.Generic;

namespace server.Models;

/// <summary>
/// To manage roofing quotes that we can provide to customers.
/// </summary>
public partial class Quote
{
    public long Id { get; set; }

    public long QuoteNumber { get; set; }

    public long CustomerId { get; set; }

    public long StatusId { get; set; }

    public DateOnly? IssueDate { get; set; }

    public DateOnly ExpirationDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public long ServiceId { get; set; }

    public double? Subtotal { get; set; }

    public double? Total { get; set; }

    public double? InvoicedTotal { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateOnly QuoteDate { get; set; }

    public string? Note { get; set; }

    /// <summary>
    /// mean to store the metric of the roof and come up with the estimated price to charge for the job.
    /// </summary>
    public string? MeasurementNote { get; set; }

    public string? CustNote { get; set; }

    public string? CustomStreetAddress { get; set; }

    public string? CustomCity { get; set; }

    public string? CustomState { get; set; }

    public string? CustomZipcode { get; set; }

    public bool? CustomAddress { get; set; }

    /// <summary>
    /// This column will be used to determine if a invoice has been converted or not.
    /// </summary>
    public bool Converted { get; set; }

    /// <summary>
    /// Note that is only visible internally and not to the customer.
    /// </summary>
    public string? PrivateNote { get; set; }

    /// <summary>
    /// Note that is only visible externally for the customer to see.
    /// </summary>
    public string? PublicNote { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<QuoteLineItem> QuoteLineItems { get; set; } = new List<QuoteLineItem>();

    public virtual Service Service { get; set; } = null!;

    public virtual QuoteStatus Status { get; set; } = null!;
}
