using System;
using System.Collections.Generic;

namespace server.Models;

/// <summary>
/// Table that stores the line items for each quote.
/// </summary>
public partial class QuoteLineItem
{
    public long Id { get; set; }

    public long QuoteId { get; set; }

    public long ServiceId { get; set; }

    public long Qty { get; set; }

    public double Amount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public double? Rate { get; set; }

    public double? SqFt { get; set; }

    public string Description { get; set; } = null!;

    public bool? FixedItem { get; set; }

    public virtual Quote Quote { get; set; } = null!;

    public virtual Service Service { get; set; } = null!;
}
