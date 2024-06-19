using System;
using System.Collections.Generic;

namespace server.Models;

public partial class InvoiceLineService
{
    public long Id { get; set; }

    public long InvoiceId { get; set; }

    public long ServiceId { get; set; }

    public double? SqFt { get; set; }

    public long Qty { get; set; }

    public double? Rate { get; set; }

    public double Amount { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    /// <summary>
    /// This column describes the service that was done. Such as writing a custom name for it.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// True or False flag to determine if to use the rate or the fixed are amount.
    /// </summary>
    public bool? FixedItem { get; set; }

    public virtual Invoice Invoice { get; set; } = null!;

    public virtual Service Service { get; set; } = null!;
}
