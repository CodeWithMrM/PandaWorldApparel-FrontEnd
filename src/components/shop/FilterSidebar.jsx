import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { formatCurrency, cn } from '@/lib/utils';

const PRICE_BRACKETS = [
  { label: 'Under R300', min: 0, max: 300 },
  { label: 'R300 – R600', min: 300, max: 600 },
  { label: 'R600 – R1,000', min: 600, max: 1000 },
  { label: 'Over R1,000', min: 1000, max: null },
];

export function FilterSidebar({ categories, filters, onChange, onReset, className }) {
  const { categoryId, priceBracket, saleOnly, inStockOnly } = filters;

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-base font-bold">Filters</h3>
        <Button variant="link" size="sm" onClick={onReset}>
          Clear all
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['category', 'price', 'availability']}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => onChange({ categoryId: null })}
                className={cn(
                  'text-left text-sm transition-colors',
                  !categoryId ? 'font-semibold text-ink' : 'text-ink/60 hover:text-ink'
                )}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onChange({ categoryId: cat.id })}
                  className={cn(
                    'text-left text-sm transition-colors',
                    categoryId === cat.id ? 'font-semibold text-ink' : 'text-ink/60 hover:text-ink'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3">
              {PRICE_BRACKETS.map((bracket) => (
                <label key={bracket.label} className="flex cursor-pointer items-center gap-2.5">
                  <Checkbox
                    checked={priceBracket?.label === bracket.label}
                    onCheckedChange={() =>
                      onChange({ priceBracket: priceBracket?.label === bracket.label ? null : bracket })
                    }
                  />
                  <span className="text-sm text-ink/75">{bracket.label}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox
                  checked={saleOnly}
                  onCheckedChange={(v) => onChange({ saleOnly: Boolean(v) })}
                />
                <span className="text-sm text-ink/75">On Sale</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox
                  checked={inStockOnly}
                  onCheckedChange={(v) => onChange({ inStockOnly: Boolean(v) })}
                />
                <span className="text-sm text-ink/75">In Stock Only</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export { PRICE_BRACKETS };
