using System;
using System.Collections.Generic;

namespace server.Models;

/// <summary>
/// Table that stores all the status for the invoices.
/// </summary>
public partial class InvoiceStatus
{
    public long Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
